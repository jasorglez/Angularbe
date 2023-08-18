/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditcoinstComponent } from './editcoinst.component';

describe('EditcoinstComponent', () => {
  let component: EditcoinstComponent;
  let fixture: ComponentFixture<EditcoinstComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditcoinstComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditcoinstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
