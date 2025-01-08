import "rxjs-compat/add/operator/map";
import { Component, OnInit } from "@angular/core";
import { DialogService, DynamicDialogComponent, DynamicDialogRef } from "primeng/dynamicdialog";

@Component({
    selector: "app-csv-collection-detail-modal",
    templateUrl: "./csv-collection-detail-modal.component.html",
    styleUrls: ["./csv-collection-detail-modal.component.css"]
})

export class CsvCollectionDetailModalComponent implements OnInit {

    instance: DynamicDialogComponent | undefined;
    content: string[];

    constructor(
        public modalReference: DynamicDialogRef,
        private dialogService: DialogService
    ) {
        this.instance = this.dialogService.getInstance(this.modalReference);
    }

    ngOnInit() {
        if (this.instance && this.instance.data) {
            this.content = this.instance.data["content"];
        }
    }
}
