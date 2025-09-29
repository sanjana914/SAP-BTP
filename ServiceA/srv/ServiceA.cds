using { ServiceA.db as data } from '../db/schema';
 
service ServiceA {
 
    @odata.draft.enabled
    entity num_range as projection on data.num_range {
        OBJECT_ID,
        range_from,
        range_to,
        current_seq
 
    };
   function getNextNumber(OBJECT_ID: String) returns cds.String;
 
}