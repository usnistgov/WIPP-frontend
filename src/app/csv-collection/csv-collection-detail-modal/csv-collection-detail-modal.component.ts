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

    lines: string[];
    linesLength: number;

    cols: string[];
    colsLength: number;

    constructor(
        public modalReference: DynamicDialogRef,
        private dialogService: DialogService
    ) {
        this.instance = this.dialogService.getInstance(this.modalReference);
    }

    ngOnInit() {
        if (this.instance && this.instance.data) {
            this.lines = this.instance.data["lines"];
            this.linesLength = this.lines.length;

            this.cols = this.instance.data["cols"];
            this.colsLength = this.cols.length;
        }
    }
}
