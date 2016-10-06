import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import pouchdb from 'pouchdb';


@Injectable()
export class Data {

    db: any;
    username: any;
    password: any;
    remote: any;
    data: any;

    constructor(public http: Http) {
        console.log('Hello Data Provider');

        this.db = new pouchdb('XXXXXX');
        this.username = 'XXXXXX';
        this.password = 'XXXXXX';
        this.remote = 'https://XXXXXXXXX-bluemix.cloudant.com/XXXXXX';


        let options = {
            live: true,
            retry: true,
            continuous: true,
            auth: {
                username: this.username,
                password: this.password
            }
        };

        this.db.sync(this.remote, options);


    }

    addDocument(doc) {
        this.db.put(doc);
    }

    getDocuments() {

        return new Promise(resolve => {
            this.db.allDocs({
                include_docs: true
            }).then((result) => {

                this.data = [];
                result.rows.map((row) => {
                    this.data.push(row.doc);
                    resolve(this.data);
                });
                this.db.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => {
                    this.handleChange(change);
                });

            }).catch((error) => {
                console.log(error);
            });

        });

    }

    handleChange(change) {

        let changedDoc = null;
        let changedIndex = null;

        this.data.forEach((doc, index) => {

            if (doc._id === change.id) {
                changedDoc = doc;
                changedIndex = index;
            }

        });

        //A document was deleted
        if (change.deleted) {
            this.data.splice(changedIndex, 1);
        }
        else {

            //A document was updated
            if (changedDoc) {
                this.data[changedIndex] = change.doc;
            }
            //A document was added
            else {
                this.data.push(change.doc);
            }

        }

    }

}





