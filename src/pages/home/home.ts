import {Component} from '@angular/core';

import {Data} from '../../providers/data';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    items: any;

    constructor(private dataProvider: Data) {
        this.dataProvider = dataProvider;
        this.items = [];

        this.dataProvider.getDocuments().then((result) => {
            this.items = result;
        });
    }

    addData() {

        console.log('addData');
        let date = new Date();

        let newDoc = {
            '_id': date,
            'message': date.getTime()
        };

        this.dataProvider.addDocument(newDoc);

    }

}
