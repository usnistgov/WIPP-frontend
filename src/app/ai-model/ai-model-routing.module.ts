import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AiModelDetailComponent } from './ai-model-detail/ai-model-detail.component';
import { AiModelListComponent } from './ai-model-list/ai-model-list.component';

const AiModelsRoutes: Routes = [
  { path: 'ai-models', component: AiModelListComponent },
  { path: 'ai-models/:id', component: AiModelDetailComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(AiModelsRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class AiModelRoutingModule {}
