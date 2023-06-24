import { AccountService } from './../account.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';


import {SelectionModel} from '@angular/cdk/collections';

import { MatTableDataSource } from '@angular/material/table';
import { iTransactions } from '../iTransactions';


@Component({
  selector: 'transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit{
  menu: string ='Transfer Transactions';
  transactions: any[]  = [];
  dataSource: any = new MatTableDataSource([]);

  constructor( 
    private authService: AuthService,
    private accountService: AccountService )
    {
      
      this.dataSource = new MatTableDataSource([]);
      accountService.getTransactions().subscribe(transactions => {
        this.transactions = []; 
        Object.values(transactions).forEach(item => {
          this.transactions.push(item)
        })

        console.log('transactions: ', this.transactions);

        this.dataSource = new MatTableDataSource(this.transactions);
      });
    }

    ngOnInit(): void {
      // this.dataSource = new MatTableDataSource([]);
      // this.subscription = this.accountService.getTransactions().subscribe(transactions => {
      //   this.transactions = []; // Reset the array
      //   Object.values(transactions).forEach(item => {
      //     this.transactions.push(item)
      //   })

      //   console.log('transactions oninit: ', this.transactions);

      //   this.dataSource = new MatTableDataSource(this.transactions);
      // });
    }


    ngOnDestroy(): void {
      // if (this.subscription) {
      //   this.subscription.unsubscribe();
      // }
    }
  

    displayedColumns: string[] = 
    ['select', 'transactionId', 'type', 'sender', 'amount', 'receiver', 'timestamp'];

    selection = new SelectionModel<iTransactions>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource?.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: iTransactions): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  revertTransaction(selectedTransactions: any[])
  {
    this.accountService.revertTransactions(selectedTransactions)
    this.selection.clear();
  }
  
}
