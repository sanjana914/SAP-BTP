namespace ServiceA.db;
 
entity num_range {
    key OBJECT_ID : String(20);
    range_from : Integer;
    range_to : Integer;
    current_seq : Integer;
}