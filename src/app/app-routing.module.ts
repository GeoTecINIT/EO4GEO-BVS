import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './ui/layout/layout.component';
import { DocumentationComponent } from './documentation/documentation.component';

const routes: Routes = [
/*   {
    path: 'documentation',
    component: DocumentationComponent
  },
  {
    path: 'documents',
    component: DocumentationComponent
  }, */
  {
    path: ':conceptId',
    pathMatch: 'full',
    component: LayoutComponent
  },
  {
    path: '',
    component: LayoutComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
