import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Product } from '../model/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
apiURL!:"https://localhost:7102/api"
  constructor(private http: HttpClient) { 
    this.apiURL="https://localhost:7102/api"
  }

  getAll(): Observable<Array<Product>> {
    console.log(this.apiURL+"/products")
    return this.http.get<Array<Product>>(this.apiURL + "/products");
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(this.apiURL+ `/products/${id}`);
  }

  createOrUpdate(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiURL+ "/products", product);
  }

  deleteById(id: string): Observable<boolean> {
    return this.http.delete<boolean>(this.apiURL + "/products/" + id);
  }
}
