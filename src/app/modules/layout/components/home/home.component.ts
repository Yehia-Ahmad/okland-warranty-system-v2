import { Component } from '@angular/core';
import { SideNavComponent } from "../side-nav/side-nav.component";
import { CommonModule } from '@angular/common';
import { InvoiceCard } from '../../../assets/invoice-card/invoice-card';

@Component({
  selector: 'app-home',
  imports: [CommonModule, InvoiceCard, SideNavComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
