import BaseFilter from "@base/filter";
import { JobSeekerReqDto } from "@jobSeeker/dtos/jobSeekerReq.dto";
import { DataFilter } from "@types";

class JobSeekerFilter extends BaseFilter {
    public handleFilter(reqParam: JobSeekerReqDto): DataFilter<JobSeekerReqDto> {
        const query = {};

        this.safelyAssign(query, "name", reqParam.name);
        this.safelyAssign(query, "lastEducation", reqParam.lastEducation);
        
        const sortKey = ["name", "lastEducation"];
        const sorter = this.handleSorter(sortKey, reqParam?.sort, reqParam?.order);

        return { query, sorter };
    }
}

export default JobSeekerFilter;