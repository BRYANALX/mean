import { TestBed } from '@angular/core/testing';

import { NavigationService } from './navigation.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('NavigationService', () => {
  let service: NavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NavigationService],
      imports: [RouterTestingModule]
    });
    service = TestBed.get(NavigationService);
  });

  it('should navigate to pins', () => {
    const navigate = spyOn((<any>service).router, 'navigate');

    service.goToPins();

    expect(navigate).toHaveBeenCalledWith(['/app/pins']);
  });

  it('should navigate to edit mode', () => {
    const navigate = spyOn((<any>service).router, 'navigate');

    service.goToEditMode();

    expect(navigate).toHaveBeenCalledWith(['/app/add']);
  });
});
