import { By } from 'cypress-selectors';
import type { Selector } from 'cypress-selectors';
export class FeedbackForm {
 @By.Text.Exact("Forms")
 static form: Selector;
//returns  cy.xpath(`//*[text()='Form']`)

  
@By.Text.Exact('Practice Form')
  static practiceform: Selector;
  // cy.xpath(`//*[text()='Form']`)


  // searchFor(term?: string): FeedbackForm {
  //   this.form.click();
  //   this.practiceform.click();
  //   return this;
  // }
}

//form = cy.xpath(`//*[text()='Form']`)
