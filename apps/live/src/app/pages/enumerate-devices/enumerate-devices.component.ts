import { Component, OnInit } from '@angular/core';
import { MediaDevicesService } from '../../media-devices.service';

@Component({
  selector: 'live-video-example-enumerate-devices',
  templateUrl: './enumerate-devices.component.html',
  styleUrls: ['./enumerate-devices.component.styl'],
})
export class EnumerateDevicesComponent implements OnInit {
  constructor(private readonly mediaDevicesService: MediaDevicesService) {}
  enumerateDevices = this.mediaDevicesService
    .enumerateDevices()
    .then((list) =>
      list.reduce((acc, it) => {
        acc[it.kind] ? acc[it.kind].push(it) : (acc[it.kind] = [it]);
        return acc;
      }, {})
    )
    .then((obj) => Object.entries(obj))
    .then((arr) => {
      var r = arr.sort((a, b) => (a[0].charAt(0) > b[0].charAt(0) ? 1 : -1));
      return r;
    });
  async ngOnInit() {}
}
