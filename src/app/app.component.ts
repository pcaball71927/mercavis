import { Component } from '@angular/core';
import { StorageService } from '../providers/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private storageService: StorageService
  ) {}

  public static get API_ENDPOINT(): string { return 'http://EC2Co-EcsEl-115295BLG6497-913538206.us-east-1.elb.amazonaws.com:3000/api'; }
}
