import { Directive, ElementRef,HostListener } from '@angular/core';

@Directive({
  selector: '[appData]'
})
export class DataDirective {

  constructor(private el:ElementRef) {
    // this.el.nativeElement.style.color = 'red'
  }

  @HostListener('document:scroll', ['$event']) onclick(e: any){
    if(pageYOffset > 100){
      this.el.nativeElement.style.display = "flex"
    } else {
      this.el.nativeElement.style.display = "none"
    }
  }

  @HostListener('click') moveTop(){
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth"
    })
  }
}
