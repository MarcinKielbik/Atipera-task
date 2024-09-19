import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { EditElementDialogComponent } from '../edit-element-dialog/edit-element-dialog.component';

export interface PeriodicElement {
  position: number;
  name: string;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'}
];

@Component({
  selector: 'app-periodic-table',
  templateUrl: './periodic-table.component.html',
  styleUrl: './periodic-table.component.scss'
})
export class PeriodicTableComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'actions'];
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  filterControl = new FormControl();
  isLoading = true; // Set the loading state to true

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.simulateDataFetch();

    this.filterControl.valueChanges
      .pipe(debounceTime(1000)) // Delay of 1 second
      .subscribe(value => {
        this.dataSource.filter = value.trim().toLowerCase();
      });
  }

  simulateDataFetch() {
    // Simulate data fetching (e.g., from an API)
    setTimeout(() => {
      this.dataSource.data = ELEMENT_DATA;
      this.isLoading = false; 
      // After the data is loaded, turn off the loading screen
    }, 3000); // Simulating a 3-second data fetch
  }

  openEditDialog(element: PeriodicElement): void {
    const dialogRef = this.dialog.open(EditElementDialogComponent, {
      width: '250px',
      data: { ...element } // Pass a copy of the object to avoid mutation
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const updatedData = this.dataSource.data.map(el => 
          el.position === result.position ? result : el
        );
        this.dataSource.data = updatedData;
      }
    });
  }
}
