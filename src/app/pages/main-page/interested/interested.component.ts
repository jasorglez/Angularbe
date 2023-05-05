import { Component } from '@angular/core';
import { TraductorService} from 'src/app/services/traductor.service';

@Component({
  selector: 'app-interested',
  templateUrl: './interested.component.html',
  styleUrls: ['./interested.component.css']
})
export class InterestedComponent {

  constructor(public translateService: TraductorService) { }


}
