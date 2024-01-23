import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Product } from '../model/product';
import { ProductService } from '../service/product.service';
import { CreateUpdateProductComponent } from '../create-update-product/create-update-product.component';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  loading!: boolean;
  products!: Array<Product>;
  displayedProduct!: Array<Product>;
  constructor(private productService: ProductService,
    private drawerService: NzDrawerService,
    private messageService: NzMessageService,
    private notificationService: NzNotificationService) {
      this.loading = false;
      this.products = [];
     }

  ngOnInit(): void {
    this.loadData();
  }
   loadData(): void {
    this.loading = true;
    this.productService.getAll().subscribe(data => {
      this.products = data;
      this.displayedProduct = this.products;
      this.loading = false;
    });
  }
  addProduct(): void {
    let drawer = this.drawerService.create({
      nzTitle: "Add Product",
      nzContent: CreateUpdateProductComponent,
      nzClosable: false,
      nzWidth: "500px",
    });
    drawer.afterClose.subscribe((product: Product) => {
      if (product != null) {
        this.products.unshift(product);
        this.displayedProduct = [...this.products];
      }
    });
  }

  updateProduct(product: Product): void {
    let drawer = this.drawerService.create({
      nzTitle: "Update Product",
      nzContent: CreateUpdateProductComponent,
      nzWidth: "500px",
      nzClosable: false,
      nzContentParams: {
        product
      },
    });

    drawer.afterClose.subscribe((product: Product) => {
      if (product != null) {
        this.products = this.products.filter(el => el.id != product.id);
        this.products.unshift(product);
        this.displayedProduct = [...this.products];
      }
    });
  }

  
  deleteProduct(id: string): void {

    let messageId = this.messageService.loading("Deleting Product").messageId;
    this.productService.deleteById(id).subscribe((isDeleted: boolean) => {
      if (isDeleted) {
        this.products = this.products.filter(el => el.id != id);
        this.displayedProduct = this.products;
        this.messageService.remove(messageId);
        this.notificationService.success("Operation Successful", "Product deleted successfully")
      } else {
        this.messageService.remove(messageId);
        this.notificationService.error("Operation failed", "Deletion operation failed");
      }
    }, _ => {
      this.messageService.remove(messageId);
      this.notificationService.error("Operation failed", "Deletion operation failed");
    });
  }

  confirm(id: string): void {
    this.deleteProduct(id);
  }

}
