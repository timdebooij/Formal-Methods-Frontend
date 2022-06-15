import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpressionComponent } from './expression/expression.component';
import { GrammarComponent } from './grammar/grammar.component';
import { NetworkComponent } from './network/network.component';
import { OperatorComponent } from './operator/operator.component';
import { TranslationComponent } from './translation/translation.component';

const routes: Routes = [
  {path: 'expression', component: ExpressionComponent},
  {path: 'network', component: NetworkComponent},
  {path: 'operator', component: OperatorComponent},
  {path: 'translation', component: TranslationComponent},
  {path: 'grammar', component: GrammarComponent},
  {path: '', redirectTo: '/expression', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
