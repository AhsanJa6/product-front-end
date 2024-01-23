import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from '../model/product';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ProductService } from '../service/product.service';
@Component({
  selector: 'app-create-update-product',
  templateUrl: './create-update-product.component.html',
  styleUrls: ['./create-update-product.component.css']
})
export class CreateUpdateProductComponent implements OnInit {
  @Input() product!: Product ;
  loading: boolean = false;
  isNew: boolean = false;
  isPresent: string = "";
  productForm!: FormGroup;
  constructor( private productService: ProductService, private drawerRef: NzDrawerRef, private notificationService: NzNotificationService, private messageService: NzMessageService) {
 this.createProductForm()
  }

  createProductForm(){
    this.productForm = new FormGroup({
      id: new FormControl('00000000-0000-0000-0000-000000000000'),
      name: new FormControl(null),
      description: new FormControl(null),
      price: new FormControl(0)
    });
  }
  ngOnInit(): void {
    this.isNew = this.product == null;
    if (!this.isNew) {
      this.productForm.patchValue(this.product);
    }
  }

  
  saveData(): void {
    this.loading = true;
    var product: Product = this.productForm.value;
    console.log(product)
    let messageId = this.messageService.loading("Saving started").messageId;
    this.productService.createOrUpdate(product).subscribe(tempProduct => {
      this.notificationService.success("Success", "Operation successful");
      this.loading = false;
      this.drawerRef.close(tempProduct);
      this.messageService.remove(messageId);
      this.productForm.reset();
    }, _ => {
      this.notificationService.error("Error", "Operation failed");
      this.loading = false;
      this.messageService.remove(messageId);
      //this.drawerRef.close(null);
    });
  }


  close(): void {
    this.drawerRef.close(null);
  }

}
