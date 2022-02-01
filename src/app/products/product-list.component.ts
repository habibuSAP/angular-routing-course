import { Component, OnInit } from '@angular/core';
import {  ActivatedRoute, 
          Router, 
          Event,
          NavigationStart,
          NavigationCancel,
          NavigationEnd,
          NavigationError} from '@angular/router';

import { Product } from './product';
import { ProductService } from './product.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  pageTitle = 'Product List';
  imageWidth = 50;
  imageMargin = 2;
  showImage = false;
  errorMessage = '';
  loading = true;

  _listFilter = '';
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredProducts = this.listFilter ? this.performFilter(this.listFilter) : this.products;
  }

  filteredProducts: Product[] = [];
  products: Product[] = [];

  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.listFilter = this.route.snapshot.queryParamMap.get('filterBy') || '';
    this.showImage = this.route.snapshot.queryParamMap.get('showImage') === 'true';
    
    this.productService.getProducts().subscribe({
      next: products => {
        this.products = products;
        this.filteredProducts = this.performFilter(this.listFilter);
      },
      error: err => this.errorMessage = err
    });

    this.router.events.subscribe((eventHapen: Event) =>{
      this.checkRouterEvent(eventHapen);
    });
  }

  checkRouterEvent(eventRouter: Event): void{
    
    if(eventRouter instanceof NavigationStart){
      this.loading = true;
    }
    if( eventRouter instanceof NavigationCancel ||
        eventRouter instanceof NavigationError ||
        eventRouter instanceof NavigationEnd) {
          this.loading = false;
        }
  }
  performFilter(filterBy: string): Product[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.products.filter((product: Product) =>
      product.productName.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  toggleImage(): void {
    this.showImage = !this.showImage;
  }

}
