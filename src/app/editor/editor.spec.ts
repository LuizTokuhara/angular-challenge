import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ArticlesService } from '../core/services/articles.service';
import { EditorComponent } from './editor.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder } from '@angular/forms';
import { of, throwError } from 'rxjs';

const fakeActivatedRoute = {
  data: of({})
} as ActivatedRoute;

describe('Editor', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        declarations: [EditorComponent],
        imports: [
          CommonModule,
          HttpClientTestingModule,
          RouterTestingModule,
        ],
        providers: [
          ArticlesService,
          FormBuilder,
          ChangeDetectorRef,
          { provide: ActivatedRoute, useValue: fakeActivatedRoute }
        ]
      })
      .overrideComponent(EditorComponent, {
        set: {  changeDetection: ChangeDetectionStrategy.OnPush  }
      })
      .compileComponents();

      fixture = TestBed.createComponent(EditorComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should return success for external API fetch', (done) => {
    const catApi = {
      status: {
        verified: false,
        sentCount: 0,
      },
      _id: '',
      type: '',
      deleted: false,
      user: '',
      text: '',
      createdAt: new Date,
      updatedAt: new Date,
      __v: 0,
    };

    const apiCall = spyOn(ArticlesService.prototype, 'getInspiration').and.returnValue(
      of(catApi)
    );
    component.ngOnInit();
    component.getInspiration();

    fixture.whenStable().then(() => {
      expect(component.apiError).toEqual(false);
      expect(apiCall).toHaveBeenCalled();
      expect(component.articleForm.get('body').value).not.toBe(null);
      done();
    });
    expect(component).toBeTruthy();
  });

  it('should return error for external API fetch', (done) => {
    spyOn(ArticlesService.prototype, 'getInspiration').and.returnValue(
      throwError('test error')
    );
    component.ngOnInit();
    component.getInspiration();

    component.apiError = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    
    fixture.whenStable().then(() => {
      expect(component.apiError).toEqual(true);
      done();
    });
  });
})