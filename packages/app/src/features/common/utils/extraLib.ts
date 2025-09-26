export const extraLib = `
    // Definición de Promise.withResolvers
    interface PromiseConstructor {
      /**
       * Returns an object containing a promise and its associated resolve/reject functions.
       * Useful for managing external promise resolution.
       */
      withResolvers<T>(): { promise: Promise<T>; resolve: (value: T) => void; reject: (reason?: any) => void };
    }
    // Definición para [].with()
    interface Array<T> {
      /**
       * Returns a new array with the element at the given index replaced by the new value.
       * @param index The index of the element to replace.
       * @param newValue The value to replace the element with.
       * @returns A new array with the updated value.
       */
      with(index: number, newValue: T): T[];
    }
          // Definición de Array.prototype.toSorted
    interface Array<T> {
      /**
       * Returns a new array with the elements sorted in ascending order by default,
       * or according to a compare function if provided.
       * @param compareFn Optional. Function to define the sort order.
       */
      toSorted(compareFn?: (a: T, b: T) => number): T[];
    }

    // Definición de Array.prototype.toSpliced
    interface Array<T> {
      /**
       * Returns a new array with some elements replaced, removed, or added.
       * Does not modify the original array.
       * @param start The index at which to start changing the array.
       * @param deleteCount The number of elements to remove.
       * @param items Elements to add to the array.
       * @returns A new array with the changes.
       */
      toSpliced(start: number, deleteCount: number, ...items: T[]): T[];
    }

    // Definición de Array.prototype.toReversed
    interface Array<T> {
      /**
       * Returns a new array with the elements in reverse order.
       * Does not modify the original array.
       */
      toReversed(): T[];
    }


    // Definición para Object.groupBy()
    interface ObjectConstructor {
      /**
       * Groups an array of items by a key selector function.
       * @param items Array of items to group.
       * @param keySelector Function to select the grouping key.
       * @returns A record with keys and grouped arrays.
       */
      groupBy<T, K extends string | number | symbol>(
        items: T[],
        keySelector: (item: T) => K
      ): Record<K, T[]>;
    }`;
