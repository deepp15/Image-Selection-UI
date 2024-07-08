import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  authKey : string = "3fXPlyOfi76kLSJ0OWWoeGEO7g6izjPdLT4BcmJW7hI=";

  constructor(private http : HttpClient) { }

  private readonly apiURL = 'http://127.0.0.1:8000/uploadfile/';
  private readonly X_ray_URL = 'http://192.168.1.28:8089/X-ray_Check'; 

  fetchData(){
    return this.http.get<any>(this.X_ray_URL);
  };

  postData(formData : FormData){
    if (!formData.has('file')){
      throw new Error('Missing image data in FormData');
    }
    const headers = new HttpHeaders().set('auth_',this.authKey);
    return this.http.post<any>(this.X_ray_URL, formData, {headers});
  }

  fetchImage(imagePath: string): Observable<Blob> {
    const url = `http://192.168.1.28:8089/${imagePath}`;
    return this.http.get(url, { responseType: 'blob' });
  }

}
