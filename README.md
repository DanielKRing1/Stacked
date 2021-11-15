# Stacked

Mobile app to track progress. Conceptually a dictionary of stacks, with a ui

# DONE

1. STACK SCHEMA FORMATTER METHOD
   1.1. Format list schema: { name: STACK_LIST_PK, [Linked Schema] }
   1.2. List schema constant pk: STACK_LIST_PK = 'stack'
   1.3. Format Linked Schema: { date, ...properties }

2. STACK CREATOR METHOD
   2.1. Save stack list schema to STACK_REALMS_PATH = 'stack-realms.path'
   2.2. Save stack properties schema to STACK_PROPERTIES_PATH = 'stack-properties.path'
   2.3. Open realm with list and properties schemas
   2.4. Save a single row to list schema

3. ADD STACK ROW (stackName, values)
   3.1. Create row obj, appending current timestamp
   3.2. Append row obj to front of stack list

4. BINARY SEARCH STACK LIST (searchDate)
   4.1. If date > index 0, return 0
   4.2. If date < last index, return last index
   4.3. Return index of closest date gte than search date

# TODO

5. GET LIST OF STACKS

    1. Get all schema names
    2. Remove suffix, and add to a set

6. DISPLAY STACK LIST IN UI

    1. Display all stacks
    2. User chooses stack
    3. Get stack
    4. Display stack

7. POP ONTO STACK
    1. Get stack properties
    2. User fills in properties
    3. User submits properties
    4. Save new snapshot onto stack
