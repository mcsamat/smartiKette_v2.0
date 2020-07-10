import { Component, OnInit, HostListener, ViewChild, ViewChildren, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

  declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
  }

export const ROUTES: RouteInfo[] = [
    { path: '/dashboard',   title: 'Dashboard',   icon:'ni-tv-2 text-primary',    class: '' },
    { path: '/smartmatch',  title: 'SmartMatch',  icon:'ni-vector text-blue',     class: '' },
    { path: '/articoli',    title: 'Articoli',    icon:'ni-cart text-blue',       class: '' },
    { path: '/etichette',   title: 'Etichette',   icon:'ni-tag text-blue',        class: '' },
    { path: '/location',    title: 'Location',    icon:'ni-pin-3 text-blue',      class: '' },
];

  @Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
  })

  @HostListener('document:mouseup', ['$event'])

export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;
  fullscreen: boolean;
  index = false;

  @ViewChild('navbarT') navv: ElementRef

  constructor(private router: Router, private renderer: Renderer2) { 

    

    
}


  ngOnInit() {
    this.fullscreen = environment.isfullscreen;
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
  }

  // APRI - Schermo Intero
  openFullscreen() {
    const docElmWithBrowsersFullScreenFunctions = document.documentElement as HTMLElement & {
      mozRequestFullScreen(): Promise<void>;
      webkitRequestFullscreen(): Promise<void>;
      msRequestFullscreen(): Promise<void>;
    };
  
    if (docElmWithBrowsersFullScreenFunctions.requestFullscreen) {
      docElmWithBrowsersFullScreenFunctions.requestFullscreen();
    } else if (docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen) { /* Firefox */
      docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen();
    } else if (docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
      docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen();
    } else if (docElmWithBrowsersFullScreenFunctions.msRequestFullscreen) { /* IE/Edge */
      docElmWithBrowsersFullScreenFunctions.msRequestFullscreen();
    }
    environment.isfullscreen = true;
    this.fullscreen = environment.isfullscreen;
  }
  
  // CHIUDI - Schermo Intero
  closeFullscreen(){
    const docWithBrowsersExitFunctions = document as Document & {
      mozCancelFullScreen(): Promise<void>;
      webkitExitFullscreen(): Promise<void>;
      msExitFullscreen(): Promise<void>;
    };

    if (docWithBrowsersExitFunctions.exitFullscreen) {
      docWithBrowsersExitFunctions.exitFullscreen();
    } else if (docWithBrowsersExitFunctions.mozCancelFullScreen) { /* Firefox */
      docWithBrowsersExitFunctions.mozCancelFullScreen();
    } else if (docWithBrowsersExitFunctions.webkitExitFullscreen) { /* Chrome, Safari and Opera */
      docWithBrowsersExitFunctions.webkitExitFullscreen();
    } else if (docWithBrowsersExitFunctions.msExitFullscreen) { /* IE/Edge */
      docWithBrowsersExitFunctions.msExitFullscreen();
    }
    environment.isfullscreen = false;
    this.fullscreen = environment.isfullscreen;
  }

    // STAMPA
    print() {
      const printContent = document.getElementById("stampare");
      const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
      WindowPrt.document.write(printContent.innerHTML);
      WindowPrt.document.close();
      WindowPrt.focus();
      WindowPrt.print();
      WindowPrt.close();
    }

    
    

    //@HostListener("document:fullscreenchange", []) 
    //fullScreen() {
    //  console.log("F11 EVENTO pt.2")
    //}
    
    //@HostListener('document:keydown', ['$event'])
    //keyEvent(event: KeyboardEvent) {
      //document.onfullscreenchange = () => console.log('fullscreenchange event fired!');
    //  console.log(event);

    //  console.log("F11 EVENTO")

    //  var maxHeight = window.screen.height,
    //    maxWidth = window.screen.width,
    //    curHeight = window.innerHeight,
    //    curWidth = window.innerWidth;


  
    //  if (event.keyCode === 122) {
    //    console.log("F11 Premuto")
    //    if (this.fullscreen == false) {
    //      console.log('From Reduct to Full: ' + this.fullscreen);
    //      environment.isfullscreen = true;
    //      this.fullscreen = environment.isfullscreen;
    //      console.log('From Reduct to Full: ' + this.fullscreen);
    //    } else if (maxWidth == curWidth && maxHeight == curHeight) {
    //      console.log('maybe it worsk')
    //        environment.isfullscreen = false;
    //        this.fullscreen = environment.isfullscreen;
    //    }
        

    //  }

    //}

    toggleClick() {
      console.log('Prima di premere il bottone menu: ' + this.isCollapsed);
      this.isCollapsed = false;
      console.log('Dopo aver premuto il bottone menu: ' + this.isCollapsed);
    }

    singleClick() {
      console.log('Prima di premere il link: ' + this.isCollapsed);
      this.isCollapsed = true;
      console.log('Dopo aver premuto il link: ' + this.isCollapsed);
    }

    

}
