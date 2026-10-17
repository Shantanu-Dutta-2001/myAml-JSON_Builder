import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { MessageService, ConfirmationService } from 'primeng/api';
import Aura from '@primeng/themes/aura';
import { definePreset } from '@primeng/themes';

// Terminal preset; keep in sync with the tokens in styles.scss.
const TerminalPreset = definePreset(Aura, {
  primitive: {
    borderRadius: { none: '0', xs: '2px', sm: '3px', md: '4px', lg: '6px', xl: '6px' }
  },
  semantic: {
    transitionDuration: '0.15s',
    primary: {
      50: '#eafff2',
      100: '#c8ffdc',
      200: '#98ffbf',
      300: '#68ffa3',
      400: '#39ff88',
      500: '#39ff88',
      600: '#2bd970',
      700: '#1fae58',
      800: '#178444',
      900: '#0f5a2e',
      950: '#08331a'
    },
    focusRing: { width: '2px', style: 'solid', color: '{primary.color}', offset: '2px', shadow: 'none' },
    overlay: {
      select: { shadow: '0 12px 28px rgba(0, 0, 0, 0.55)' },
      popover: { shadow: '0 12px 28px rgba(0, 0, 0, 0.55)' },
      modal: { shadow: '0 24px 48px rgba(0, 0, 0, 0.6)' }
    },
    colorScheme: {
      dark: {
        surface: {
          0: '#ffffff',
          50: '#eef7f0',
          100: '#dcefe2',
          200: '#b9d6c2',
          300: '#94b59f',
          400: '#6e8f79',
          500: '#4e6656',
          600: '#2b3b30',
          700: '#1f2b22',
          800: '#18201a',
          900: '#111712',
          950: '#0b0f0c'
        },
        primary: { color: '#39ff88', contrastColor: '#0b0f0c', hoverColor: '#68ffa3', activeColor: '#2bd970' },
        highlight: {
          background: 'rgba(57, 255, 136, 0.12)',
          focusBackground: 'rgba(57, 255, 136, 0.2)',
          color: '#39ff88',
          focusColor: '#39ff88'
        },
        mask: { background: 'rgba(5, 8, 6, 0.78)', color: '{surface.200}' },
        formField: {
          background: '#0d120e',
          disabledBackground: '#18201a',
          filledBackground: '#0d120e',
          filledHoverBackground: '#0d120e',
          filledFocusBackground: '#0b0f0c',
          borderColor: '#2b3b30',
          hoverBorderColor: '#4e6656',
          focusBorderColor: '#39ff88',
          invalidBorderColor: '#ff5c5c',
          color: '#dcefe2',
          disabledColor: '#6e8f79',
          placeholderColor: '#6e8f79',
          invalidPlaceholderColor: '#ff5c5c',
          iconColor: '#6e8f79',
          shadow: 'none'
        },
        text: { color: '#dcefe2', hoverColor: '#ffffff', mutedColor: '#6e8f79', hoverMutedColor: '#9be7b4' },
        content: {
          background: '#111712',
          hoverBackground: '#18201a',
          borderColor: '#1f2b22',
          color: '{text.color}',
          hoverColor: '{text.hover.color}'
        },
        overlay: {
          select: { background: '#111712', borderColor: '#2b3b30', color: '{text.color}' },
          popover: { background: '#111712', borderColor: '#2b3b30', color: '{text.color}' },
          modal: { background: '#111712', borderColor: '#2b3b30', color: '{text.color}' }
        },
        list: {
          option: {
            focusBackground: '#18201a',
            selectedBackground: 'rgba(57, 255, 136, 0.1)',
            selectedFocusBackground: 'rgba(57, 255, 136, 0.16)',
            color: '{text.color}',
            focusColor: '#ffffff',
            selectedColor: '#39ff88',
            selectedFocusColor: '#39ff88'
          }
        }
      }
    }
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: TerminalPreset,
        options: {
          darkModeSelector: '.app-dark',
          cssLayer: {
            name: 'primeng',
            order: 'tailwind-base, primeng, tailwind-utilities'
          }
        }
      }
    }),
    MessageService,
    ConfirmationService
  ]
};
