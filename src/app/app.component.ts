import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { ApiServiceService } from './api-service.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  
  
})
export class AppComponent {
  title = 'my-app';
  imageURL : string | ArrayBuffer  | null=null;
  showSecondComponent = false;
  showFirstComponent = false;
  fetchedData : any;
  result : any = {}
  // private readonly apiURL : string;
  private readonly X_ray_URL = 'http://192.168.1.28:8089/X-ray_Check'; 
  textData = 'stringggg';
  selectedImage : string | undefined;
  receivedImageURL : string = ''; 

  providerId = "1";
  claimid = "015678";
  servicetype = "claim";
  type = "x-ray_defect";

  constructor(private apiService : ApiServiceService) {

  }

  ngOnInit() {}

  // fetchData() {
  //   this.apiService.fetchData<any>(this.apiURL)
  //     .subscribe(data => {
  //       this.fetchedData = data;
  //       console.log("Fetched data:",this.fetchedData);
  //     })
  // }

  // postData(imageData : any) : void {
  //   this.http.post<any>(this.apiURL, imageData)
  //   .pipe(
  //     tap(response => console.log('Image uploaded', response)),
  //     catchError(error => {
  //       console.error("error uploading image", error);
  //       return throwError(error);
  //     })
  //   ).subscribe();
  // }

  // postData(textData : string) : void {
  //   this.http.post<any>(this.apiURL, textData)
  //   .pipe(
  //     tap(response => console.log('text uploaded', response)),
  //     catchError(error => {
  //       console.error("error uploading Text", error);
  //       return throwError(error);
  //     })
  //   ).subscribe();
  // }

  convertFileToDataURL(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.selectedImage = reader.result as string;
    };
  }

  handleFileSelect( event : any) : void {
    const file = event.target.files[0];
    
    if (file) {
      console.log('selected file : ', file);
      this.convertFileToDataURL(file);
      this.showFirstComponent = true;
      this.showSecondComponent = true;
      }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('providerId', this.providerId );
    formData.append('claimid', this.claimid );
    formData.append('servicetype', this.servicetype );
    formData.append('type', this.type );
    
    this.apiService.postData(formData).subscribe(
      (data : any) => {
        console.log("API response : ", data);
        console.log("Image path .... ",data.Image_Path);
        // this.receivedImageURL = `http://192.168.1.28:8089/${data.Image_Path}`;
        console.log("API Image RESULT :::::::::: : ",`http://192.168.1.28:8089/${data.Image_Path}`);
        this.fetchImage(data.Image_Path);
        this.result = data;
        
        console.log("API RESULT : ",this.result.Type);
        console.log("API RESPONSE OBJECT: ", JSON.stringify(data, null, 2));
      },(error : any) => {
        console.error("API error : ",error);
      }
    )  
  }

  fetchImage(imagePath: string): void {
    this.apiService.fetchImage(imagePath).subscribe(
      (blob: Blob) => {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          this.receivedImageURL = event.target.result;
        };
        reader.readAsDataURL(blob);
      },
      (error: any) => {
        console.error("Error fetching image: ", error);
      }
    );
  }

  openFilePicker(event : any) : void {
    document.getElementById('fileInput')?.click();
  }

  displayImage(file : File) : void {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imageURL = e.target?.result as string | ArrayBuffer;
    };
    reader.readAsDataURL(file);
  }

  openImage() : void {
    if (this.imageURL){
      this.imageURL = null;
      this.showFirstComponent = true;
      this.showSecondComponent = true;
    } 
    else {
      const input = document.getElementById('fileInput') as HTMLInputElement;
      if (input && input.files && input.files.length > 0){
          const file = input.files[0];
          this.showFirstComponent = true;
          this.showSecondComponent = true;
          this.displayImage(file);
        } 
      else {
          console.log("No Image");  
      }  
    }
  }

  
}
