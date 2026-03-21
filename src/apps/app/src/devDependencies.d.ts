
// This file is used to declare modules for packages that don't have types
// or to extend existing types.

declare module 'jspdf' {
    interface jsPDF {
      html(element: HTMLElement | string, options?: any): Promise<any>;
    }
}
