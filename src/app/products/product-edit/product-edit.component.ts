import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from '../../messages/message.service';

import { Product, ProductResolved } from '../product';
import { ProductService } from '../product.service';

@Component({
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit{
  pageTitle = 'Product Edit';
  errorMessage: string;
 
  get isDirty(): boolean {
    return (JSON.stringify(this.originalProducts) !== JSON.stringify(this.currentProducts));
  }
  private currentProducts: Product;
  private originalProducts: Product;

  get product(): Product {
    return this.currentProducts;
  }

  set product(value: Product){
    this.currentProducts = value;
    //clone the object to retain a copy
    this.originalProducts = {...value};
  }
  private dataIsValid: {[key:string]: boolean};

  constructor(private productService: ProductService,
              private messageService: MessageService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.route.data.subscribe( data => {
        const resolvedData: ProductResolved = data['resolvedData'];
        this.errorMessage = resolvedData.error;
        this.onProductRetrieved(resolvedData.product);
    });
  
  }


  onProductRetrieved(product: Product): void {
    this.product = product;

    if (!this.product) {
      this.pageTitle = 'No product found';
    } else {
      if (this.product.id === 0) {
        this.pageTitle = 'Add Product';
      } else {
        this.pageTitle = `Edit Product: ${this.product.productName}`;
      }
    }
  }

  deleteProduct(): void {
    if (this.product.id === 0) {
      // Don't delete, it was never saved.
      this.onSaveComplete(`${this.product.productName} was deleted`);
    } else {
      if (confirm(`Really delete the product: ${this.product.productName}?`)) {
        this.productService.deleteProduct(this.product.id).subscribe({
          next: () => this.onSaveComplete(`${this.product.productName} was deleted`),
          error: err => this.errorMessage = err
        });
      }
    }

  }

  isValid(path?: string): boolean {
    this.validate();
    if(path) {
      return this.dataIsValid[path];
    } 
    return (this.dataIsValid && 
        Object.keys(this.dataIsValid).every(d => this.dataIsValid[d] === true));
  }

  saveProduct(): void {
    if (this.isValid()) {
      if (this.product.id === 0) {
        this.productService.createProduct(this.product).subscribe({
          next: () => this.onSaveComplete(`The new ${this.product.productName} was saved`),
          error: err => this.errorMessage = err
        });
      } else {
        this.productService.updateProduct(this.product).subscribe({
          next: () => this.onSaveComplete(`The updated ${this.product.productName} was saved`),
          error: err => this.errorMessage = err
        });
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  reset(): void {
    this.dataIsValid = null;
    this.currentProducts = null;
    this.originalProducts = null;
   
  }
  onSaveComplete(message?: string): void {
    if (message) {
      this.messageService.addMessage(message);
    }
    // Navigate back to the product list
    this.reset();
    this.router.navigate(['/products']);
  }

  validate(): void {
    this.dataIsValid = {};

    if (this.product.productName && 
        this.product.productName.length >= 3 &&
        this.product.productCode){
          this.dataIsValid['info'] = true;
        } else {
          this.dataIsValid['info'] = false;
        }
    
    if (this.product.category &&
        this.product.category.length >= 3) {
          this.dataIsValid['tags'] = true;
        } else {
          this.dataIsValid['tags'] = false;
        }
  }
}
