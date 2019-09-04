import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
class WindowService {
  get _window(): Window {
    return window;
  }
}

@Injectable({
  providedIn: 'root'
})
class ExampleService {
  private url = 'https://example.com';

  constructor(private windowService: WindowService) {}

  redirect1() {
    window.location.href = this.url;
  }

  redirect2() {
    this.windowService._window.location.href = this.url;
  }

  redirect3() {
    this._windowLocationHref(this.url);
  }

  redirect4(_window: Window = window) {
    _window.location.href = this.url;
  }

  _windowLocationHref(url: string) {
    window.location.href = url;
  }
}

describe('window test strategies', () => {
  let windowServiceTestDouble: WindowService;
  let exampleService: ExampleService;

  beforeEach(() => {
    windowServiceTestDouble = {
      _window: { location: { href: '' } }
    } as WindowService;

    TestBed.configureTestingModule({
      providers: [
        { provide: WindowService, useFactory: () => windowServiceTestDouble },
        ExampleService
      ]
    });

    exampleService = TestBed.get(ExampleService);
  });

  it('redirect1', () => {
    const { configurable: hrefConfigurable } = Object.getOwnPropertyDescriptor(
      window.location,
      'href'
    );
    expect(hrefConfigurable).toBe(true, `can't install spy => can't test`);
  });

  it('redirect2', () => {
    exampleService.redirect2();
    expect(windowServiceTestDouble._window.location.href).toEqual(
      'https://example.com'
    );
  });

  it('redirect3', () => {
    spyOn(exampleService, '_windowLocationHref');
    exampleService.redirect3();
    expect(exampleService._windowLocationHref).toHaveBeenCalledWith(
      'https://example.com'
    );
  });

  it('redirect4', () => {
    const windowTestDouble = {
      location: { href: '' }
    } as Window;
    exampleService.redirect4(windowTestDouble);
    expect(windowTestDouble.location.href).toEqual('https://example.com');
  });
});
