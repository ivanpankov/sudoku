import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appDigitOnly]',
  standalone: true,
})
export class DigitOnlyDirective {
  private navigationKeys = [
    'Backspace',
    'Delete',
    'Tab',
    'Escape',
    'Enter',
    'Home',
    'End',
    'ArrowLeft',
    'ArrowRight',
    'Clear',
    'Copy',
    'Paste',
  ];

  constructor() {}

  @HostListener('keydown', ['$event']) onKeyDown(e: KeyboardEvent) {
    if (
      this.navigationKeys.indexOf(e.key) > -1 || // Allow: navigation keys: backspace, delete, arrows etc.
      ((e.key === 'a' || e.code === 'KeyA') && e.ctrlKey === true) || // Allow: Ctrl+A
      ((e.key === 'c' || e.code === 'KeyC') && e.ctrlKey === true) || // Allow: Ctrl+C
      ((e.key === 'v' || e.code === 'KeyV') && e.ctrlKey === true) || // Allow: Ctrl+V
      ((e.key === 'x' || e.code === 'KeyX') && e.ctrlKey === true) || // Allow: Ctrl+X
      ((e.key === 'a' || e.code === 'KeyA') && e.metaKey === true) || // Allow: Cmd+A (Mac)
      ((e.key === 'c' || e.code === 'KeyC') && e.metaKey === true) || // Allow: Cmd+C (Mac)
      ((e.key === 'v' || e.code === 'KeyV') && e.metaKey === true) || // Allow: Cmd+V (Mac)
      ((e.key === 'x' || e.code === 'KeyX') && e.metaKey === true) // Allow: Cmd+X (Mac)
    ) {
      // let it happen, don't do anything
      return;
    }

    if (isDigit(e.key)) {
      return;
    }

    e.preventDefault();
  }

  @HostListener('paste', ['$event']) onPaste(e: ClipboardEvent) {
    const data = e.clipboardData?.getData('text/plain') ?? ' ';
    const char = data[0];
    if (isDigit(char)) {
      return;
    }
    e.preventDefault();
  }

  @HostListener('drop', ['$event']) onDrop(e: DragEvent) {
    const data = e.dataTransfer?.getData('text/plain') ?? ' ';
    const char = data[0];
    if (isDigit(char)) {
      return;
    }
    e.preventDefault();
  }
}

function isDigit(char: string): boolean {
  return char >= '1' && char <= '9';
}
