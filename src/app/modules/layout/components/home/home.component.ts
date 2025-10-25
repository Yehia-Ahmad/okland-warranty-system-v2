import { Component } from '@angular/core';
import { SideNavComponent } from "../side-nav/side-nav.component";
import { CommonModule } from '@angular/common';
import { InvoiceCardComponent } from '../../../assets/invoice-card/invoice-card.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, InvoiceCardComponent, SideNavComponent],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

}
