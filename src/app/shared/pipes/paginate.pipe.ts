import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'paginate',
  pure: false
})
export class PaginatePipe implements PipeTransform {
  transform(collection: any[], args: any): any {
    console.log(collection);
    console.log(args);

    let itermPerPage = args.itemsPerPage || 5;
    let currentPage = args.currentPage || 1;
    let start, end;

    if(collection instanceof Array) {
      start = (currentPage - 1) * itermPerPage;
      end = start + itermPerPage;

      let slice = collection.slice(start, end);
      return slice;
    }

    return collection;
  }
}
