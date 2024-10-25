import {Directive,Output,EventEmitter,ElementRef,HostListener} from '@angular/core';


@Directive({selector: '[appSortParams]',standalone: true})
export class SortParamsDirective {
  @Output() param:EventEmitter<any>=new EventEmitter();
constructor(private element:ElementRef) { }
  @HostListener('click') onClickIcon(){
  this.selectSort(this.element.nativeElement.id)
  }
  selectSort(id: string){
    switch(id){
      case 'roomAsc':
        this.param.emit({dir:'asc',col:'room',typ:'string'})
        break;
      case 'roomDesc':
        this.param.emit({dir:'desc',col:'room',typ:'string'})
        break;
      case 'bedsAsc':
        this.param.emit({dir:'asc',col:'beds',typ:'string'})
        break;
      case 'bedsDesc':
        this.param.emit({dir:'desc',col:'beds',typ:'string'})
        break;
    }
  }
}

