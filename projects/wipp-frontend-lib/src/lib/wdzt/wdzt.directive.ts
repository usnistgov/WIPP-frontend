import {AfterContentChecked, AfterContentInit, AfterViewInit, Directive, ElementRef, Input, OnChanges, SimpleChanges} from '@angular/core';
declare var WDZT: any;

@Directive({
  selector: 'wippWdzt'
})
export class WdztDirective implements AfterViewInit, OnChanges {

  @Input() public manifest: any;
  private w: any;

  constructor(private elem: ElementRef) {
  }

  ngAfterViewInit() {
    const id = this.elem.nativeElement.id = this.elem.nativeElement.id || WDZT.guid();
    this.w = WDZT({
      id: id,
      imagesPrefix: 'assets/wdzt/images/',
      OpenSeadragon: {
        crossOriginPolicy: 'Anonymous'
      },
      autoAdjustHeight: true
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.manifest) {
      if (!this.manifest) {
        return;
      }
      try {
        this.manifest = typeof this.manifest === 'string'
          ? JSON.parse(this.manifest) : this.manifest;
        this.w.open(this.manifest);
      } catch (er) {
        // The manifest is probably just a URL, let WDZT deal with it.
      }
    }
  }

}
