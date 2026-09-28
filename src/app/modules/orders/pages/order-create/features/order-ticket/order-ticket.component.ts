import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { IconComponent } from 'src/ui';
import { formatCurrency } from '../../../order-list/ui';
import { CartLine, QUICK_NOTES } from '../cart-line';

export type CartNoteChange = Readonly<{ key: string; note: string }>;

@Component({
  selector: 'app-order-ticket',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './order-ticket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderTicketComponent {
  readonly lines = input.required<CartLine[]>();

  readonly increment = output<string>();
  readonly decrement = output<string>();
  readonly remove = output<string>();
  readonly noteChange = output<CartNoteChange>();

  readonly formatCurrency = formatCurrency;
  readonly quickNotes = QUICK_NOTES;
  // Línea cuya nota se está editando.
  readonly $editingKey = signal<string | null>(null);
  readonly $draft = signal('');

  readonly $total = computed(() => this.lines().reduce((sum, line) => sum + line.unitPrice * line.quantity, 0));
  readonly $itemCount = computed(() => this.lines().reduce((sum, line) => sum + line.quantity, 0));

  editNote(line: CartLine) {
    this.$draft.set(line.note);
    this.$editingKey.set(line.key);
  }

  // Las notas rápidas se suman a lo escrito ("sin palta, sin mayo").
  addQuickNote(note: string) {
    const current = this.$draft().trim();
    if (current.toLowerCase().includes(note)) return;
    this.$draft.set(current ? `${current}, ${note}` : note);
  }

  onDraft(event: Event) {
    this.$draft.set((event.target as HTMLInputElement).value);
  }

  saveNote(key: string) {
    this.noteChange.emit({ key, note: this.$draft() });
    this.$editingKey.set(null);
  }

  cancelNote() {
    this.$editingKey.set(null);
  }
}
