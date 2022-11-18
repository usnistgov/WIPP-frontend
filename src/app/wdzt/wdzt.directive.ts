import {AfterContentChecked, AfterContentInit, AfterViewInit, Directive, ElementRef, Input, OnChanges, SimpleChanges} from '@angular/core';
import {KeycloakService} from '../services/keycloak/keycloak.service';

@Directive({
  selector: 'wippWdzt'
})
export class WdztDirective implements AfterViewInit, OnChanges {

  @Input() public manifest: any;
  private w: any;

  constructor(private elem: ElementRef,
              private keycloakService: KeycloakService) {
  }

  ngAfterViewInit() {
    const id = this.elem.nativeElement.id = this.elem.nativeElement.id || WDZT.guid();
    let ajaxHeaders = {};
    if (this.keycloakService.isLoggedIn()) {
      ajaxHeaders = {
        Authorization: `Bearer ${this.keycloakService.getKeycloakAuth().token}`
      };
    }
    this.w = WDZT({
      id: id,
      imagesPrefix: 'assets/wdzt/images/',
      OpenSeadragon: {
        maxZoomPixelRatio: Infinity,
        crossOriginPolicy: 'Anonymous',
        loadTilesWithAjax: true,
        ajaxHeaders: ajaxHeaders
      },
      autoAdjustHeight: true,
      autoAdjustMinHeight: 500
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
