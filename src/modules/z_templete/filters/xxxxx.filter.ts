// import BaseFilter from "@base/filter";
// import { DataFilter } from "@types";

// class XxxxxFilter extends BaseFilter {
//   public handleFilter(reqParam: XxxxGetDto): DataFilter<XxxxGetDto> {
//     const query = {};

//     this.safelyAssign(query, "name", reqParam.name);
//     this.safelyAssign(query, "email", reqParam.email);

//     const sortKey = ["name", "email"];
//     const sorter = this.handleSorter(sortKey, reqParam?.sort, reqParam?.order);

//     return { query, sorter };
//   }
// }

// export default XxxxxFilter;
