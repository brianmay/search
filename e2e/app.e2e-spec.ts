import { WGNHSPage } from './app.po';

describe('wgnhs App', () => {
  let page: WGNHSPage;

  beforeEach(() => {
    page = new WGNHSPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
