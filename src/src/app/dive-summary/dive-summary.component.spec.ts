import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiveSummaryComponent } from './dive-summary.component';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';
import { HumanDurationPipe } from '../pipes/human-duration.pipe';

describe('DiveSummaryComponent', () => {
  let component: DiveSummaryComponent;
  let fixture: ComponentFixture<DiveSummaryComponent>;
  let mockDivePlannerService: jasmine.SpyObj<DivePlannerService>;

  beforeEach(async () => {
    mockDivePlannerService = jasmine.createSpyObj('DivePlannerService', ['getTimeToFly', 'getDiveDuration', 'getMaxDepth', 'getAverageDepth']);

    await TestBed.configureTestingModule({
      declarations: [DiveSummaryComponent, HumanDurationPipe],
      providers: [
        { provide: DivePlannerService, useValue: mockDivePlannerService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DiveSummaryComponent);
    component = fixture.componentInstance;

    // Set up default mock returns
    mockDivePlannerService.getDiveDuration.and.returnValue(1800);
    mockDivePlannerService.getMaxDepth.and.returnValue(30);
    mockDivePlannerService.getAverageDepth.and.returnValue(25);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format time to fly correctly for no waiting time', () => {
    mockDivePlannerService.getTimeToFly.and.returnValue(0);
    expect(component.getTimeToFlyFormatted()).toBe('None');
  });

  it('should format time to fly correctly for minutes only', () => {
    mockDivePlannerService.getTimeToFly.and.returnValue(1800); // 30 minutes
    expect(component.getTimeToFlyFormatted()).toBe('30 min');
  });

  it('should format time to fly correctly for hours only', () => {
    mockDivePlannerService.getTimeToFly.and.returnValue(7200); // 2 hours
    expect(component.getTimeToFlyFormatted()).toBe('2 hr');
  });

  it('should format time to fly correctly for hours and minutes', () => {
    mockDivePlannerService.getTimeToFly.and.returnValue(9000); // 2 hours 30 minutes
    expect(component.getTimeToFlyFormatted()).toBe('2 hr 30 min');
  });

  it('should format time to fly correctly for undefined (> 5 hours)', () => {
    mockDivePlannerService.getTimeToFly.and.returnValue(undefined);
    expect(component.getTimeToFlyFormatted()).toBe('> 5 hours');
  });
});
