import { booleanAttribute, ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, output, signal } from '@angular/core';
import {
  formatBytes,
  IMAGE_ACCEPT,
  IMAGE_MAX_BYTES,
  ImageSelection,
  StorageFolder,
  validateImage,
} from 'src/app/core/services/file-upload';
import { IconComponent, ImageThumbComponent } from '../../atoms';
import { ToastService } from '../toast';

/**
 * Selector de imagen para formularios. No sube nada: emite lo que eligió el usuario
 * (keep / set / remove) y el formulario sube el archivo recién al guardar.
 */
@Component({
  selector: 'app-image-picker',
  imports: [IconComponent, ImageThumbComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './image-picker.component.html',
})
export class ImagePickerComponent {
  readonly #toast = inject(ToastService);

  readonly $folder = input.required<StorageFolder>({ alias: 'folder' });
  /** Imagen actual del recurso (al modificar). */
  readonly $currentUrl = input<string | null | undefined>(null, { alias: 'currentUrl' });
  readonly $label = input<string>('Imagen', { alias: 'label' });
  readonly $round = input(false, { alias: 'round', transform: booleanAttribute });
  readonly $disabled = input<boolean>(false, { alias: 'disabled' });
  readonly $uploading = input<boolean>(false, { alias: 'uploading' });
  readonly $progress = input<number>(0, { alias: 'progress' });

  readonly selectionChange = output<ImageSelection>({ alias: 'selectionChange' });

  protected readonly accept = IMAGE_ACCEPT;
  protected readonly inputId = `image-picker-${Math.random().toString(36).slice(2, 9)}`;

  readonly #selection = signal<ImageSelection>({ kind: 'keep' });
  readonly #previewUrl = signal<string | null>(null);
  protected readonly $dragOver = signal(false);

  protected readonly $shownUrl = computed(() => {
    const selection = this.#selection();
    if (selection.kind === 'set') return this.#previewUrl();
    if (selection.kind === 'remove') return null;
    return this.$currentUrl() ?? null;
  });
  protected readonly $hasImage = computed(() => !!this.$shownUrl());
  protected readonly $isChanged = computed(() => this.#selection().kind !== 'keep');
  protected readonly $hint = computed(() => `JPG, PNG o WEBP · máx. ${formatBytes(IMAGE_MAX_BYTES[this.$folder()])}`);
  protected readonly $fileName = computed(() => {
    const selection = this.#selection();
    return selection.kind === 'set' ? selection.file.name : null;
  });

  constructor() {
    inject(DestroyRef).onDestroy(() => this.#revokePreview());
  }

  protected onFileInput(event: Event) {
    const inputEl = event.target as HTMLInputElement;
    const file = inputEl.files?.[0];
    inputEl.value = '';
    if (file) this.#pick(file);
  }

  protected onDrop(event: DragEvent) {
    event.preventDefault();
    this.$dragOver.set(false);
    if (this.$disabled() || this.$uploading()) return;
    const file = event.dataTransfer?.files?.[0];
    if (file) this.#pick(file);
  }

  protected onDragOver(event: DragEvent) {
    event.preventDefault();
    if (!this.$disabled()) this.$dragOver.set(true);
  }

  protected remove() {
    this.#setSelection(this.$currentUrl() ? { kind: 'remove' } : { kind: 'keep' });
  }

  protected undo() {
    this.#setSelection({ kind: 'keep' });
  }

  #pick(file: File) {
    const error = validateImage(file, this.$folder());
    if (error) {
      this.#toast.show(error, 'error');
      return;
    }
    this.#setSelection({ kind: 'set', file });
  }

  #setSelection(selection: ImageSelection) {
    this.#revokePreview();
    if (selection.kind === 'set') this.#previewUrl.set(URL.createObjectURL(selection.file));
    this.#selection.set(selection);
    this.selectionChange.emit(selection);
  }

  #revokePreview() {
    const url = this.#previewUrl();
    if (url) URL.revokeObjectURL(url);
    this.#previewUrl.set(null);
  }
}
