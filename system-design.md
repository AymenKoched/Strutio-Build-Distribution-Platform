# Strutio - Design and Implement a Filtering System

# **My Approach to the Problem**

To tackle the filtering system challenge, the following approach was adopted:

1. **Requirement Analysis**:
   - Detailed study of the requirements and example scenarios.
   - Identification of the key features: filter creation, editing, application, saving, and sharing via URL.
2. **System Design**:
   - Modularized the application into reusable components.
   - Adopted a scalable data model to handle nested filter groups and conditions.
3. **Frontend Implementation**:
   - Created reusable components like `FilterForm`, `FilterList`, `BuildList`, `FilterCard`, and `BuildCard`.
   - Focused on an intuitive and responsive UI to enhance user experience.
4. **Backend Implementation**:
   - Designed APIs for filter creation, retrieval, and application.
   - Used Prisma as the ORM for robust and efficient database interactions.
   - Added Zod for backend validation to ensure data consistency.
5. **URL Sharing Strategy**:
   - Integrated filter sharing using URL parameters.
   - Built a seamless mechanism to apply filters based on shared URLs.

# Data Model for Filters

### 1. Filter

The main entity that serves as an entry point for the filter hierarchy.

- id (String): Unique identifier
- name (String): Human-readable filter name
- filterGroupId (String): References the root FilterGroup
- createdAt (DateTime): Creation timestamp
- updatedAt (DateTime): Last update timestamp

### 2. FilterGroup

Represents logical groups of conditions or other filter groups.

- id (String): Unique identifier
- operator (FilterGroupOperator): AND/OR logical operator
- filterConditionId (String, optional): Reference to a FilterCondition
- parentGroupId (String, optional): Reference to parent group
- subGroups (Array): Collection of nested FilterGroups

### 3. FilterCondition

Defines the actual filtering logic.

- id (String): Unique identifier
- attributeId (String): Reference to filtered attribute
- operator (FilterConditionOperator): Comparison operator
- value (String): Comparison value

## 4. Enumerations

### FilterGroupOperator

- AND
- OR

### FilterConditionOperator

- EQUALS
- NOT_EQUALS
- GREATER_THAN
- GREATER_THAN_EQUALS
- LESS_THAN
- LESS_THAN_EQUALS
- CONTAINS

# API Design

## 1. Create Filter

**Endpoint:** POST /api/filters

### Request Structure

```tsx
type FilterConditionDTO = {
  operatorGroup?: FilterGroupOperator;
  attributeId: string;
  operator: FilterConditionOperator;
  value: string;
};

type FilterDTO = {
  name: string;
  filterGroups: FilterConditionDTO[];
};
```

### Example Request

to create this expression:

`(platform = 'ios' OR isProduction = true) AND testCoverage > 80`

### **Processing Logic**

1. **Initialize the Filter**:
   - Create the Filter using the name field from the request body.
2. **Process Filter Conditions and Groups**:
   - For each filterGroup item:
     - Create a FilterCondition using attributeId, operator, and value.
     - Create a FilterGroup for this condition.
     - If operatorGroup is present:
       - Combine the current group and previously created groups with the next group using the specified operatorGroup.
     - Store the resulting group for the next iteration.
3. **Link Final Group to Filter**:
   - Assign the last created group as the root group of the Filter.

```json
{
  "name": "Production or iOS Builds with High Test Coverage",
  "filterGroups": [
    {
      "operatorGroup": "OR",
      "attributeId": "platform",
      "operator": "EQUALS",
      "value": "IOS"
    },
    {
      "operatorGroup": "AND",
      "attributeId": "isProduction",
      "operator": "EQUALS",
      "value": "true"
    },
    {
      "attributeId": "testCoverage",
      "operator": "GREATER_THAN",
      "value": "80"
    }
  ]
}
```

## 2. Get Filter

**Endpoint:** GET /api/filters/:id

Returns a detailed filter structure including all nested groups and conditions.

If a group has an operator (OR or AND), the next two items will be its subgroups. If a group does not have an operator, it will contain a filterCondition that specifies the attribute, the comparison operator (e.g., EQUALS, LESS_THAN), and the value, such as _isProduction equals true_.

### Response Structure

The response includes the complete filter hierarchy with:

- Filter groups with their operators
- Nested conditions
- Associated attributes
- All relevant relationships and metadata

### Example Response Excerpt

to get this expression:

`(platform = 'ios' OR isProduction = true) AND testCoverage > 80`

```json
{
  "filterGroups": [
    {
      "id": "cm4g41b9t00brg3utqe2sut94",
      "operator": "AND",
      "filterConditionId": null,
      "parentGroupId": null,
      "filterCondition": null
    },
    {
      "id": "cm4g41b9s00bqg3utpenf98vw",
      "operator": null,
      "filterConditionId": "cm4g41b9q00bog3ut0otu753d",
      "parentGroupId": "cm4g41b9t00brg3utqe2sut94",
      "filterCondition": {
        "id": "cm4g41b9q00bog3ut0otu753d",
        "attributeId": "cm4ffdv6n0024g3ut3n6ao3sw",
        "operator": "GREATER_THAN",
        "value": "80",
        "attribute": {
          "id": "cm4ffdv6n0024g3ut3n6ao3sw",
          "name": "testCoverage",
          "type": "number"
        }
      }
    },
    {
      "id": "cm4g41b9g00bmg3utym49jo0k",
      "operator": "OR",
      "filterConditionId": null,
      "parentGroupId": "cm4g41b9t00brg3utqe2sut94",
      "filterCondition": null
    },
    {
      "id": "cm4g41b9e00blg3utp9v72pfe",
      "operator": null,
      "filterConditionId": "cm4g41b9b00bjg3utcrbffkkm",
      "parentGroupId": "cm4g41b9g00bmg3utym49jo0k",
      "filterCondition": {
        "id": "cm4g41b9b00bjg3utcrbffkkm",
        "attributeId": "cm4ffdv6r0025g3utqqp2ov9n",
        "operator": "EQUALS",
        "value": "true",
        "attribute": {
          "id": "cm4ffdv6r0025g3utqqp2ov9n",
          "name": "isProduction",
          "type": "boolean"
        }
      }
    },
    {
      "id": "cm4g41b9600bhg3ut42hj8pkx",
      "operator": null,
      "filterConditionId": "cm4g41b6q00bfg3utir3zsfts",
      "parentGroupId": "cm4g41b9g00bmg3utym49jo0k",
      "filterCondition": {
        "id": "cm4g41b6q00bfg3utir3zsfts",
        "attributeId": "cm4ffdv6c0022g3utazpnxb76",
        "operator": "EQUALS",
        "value": "IOS",
        "attribute": {
          "id": "cm4ffdv6c0022g3utazpnxb76",
          "name": "platform",
          "type": "string"
        }
      }
    }
  ]
}
```

## 3. Filter Builds

**Endpoint:** GET /api/builds?filterId={filterId}

**Purpose**

Retrieve builds based on a filter:

- If filterId is provided, the builds are filtered according to the specified filter
- If filterId is not provided, all builds are returned

### **Filter Query Logic**

Given a filter expression from the get detailed filter API, the API constructs a query based on the filter's detailed structure.

### **Example Expression**

`(platform = 'ios' OR isProduction = true) AND testCoverage > 80`

**Generated Query:**

```json
{
  "AND": [
    {
      "AttributeBuilds": {
        "some": {
          "attributeId": "testCoverage",
          "value": {
            "gt": "80"
          }
        }
      }
    },
    {
      "OR": [
        {
          "AttributeBuilds": {
            "some": {
              "attributeId": "isProduction",
              "value": {
                "equals": "true"
              }
            }
          }
        },
        {
          "AttributeBuilds": {
            "some": {
              "attributeId": "platform",
              "value": {
                "equals": "IOS"
              }
            }
          }
        }
      ]
    }
  ]
}
```

# **Component Structure**

### **Home Page**

- **`FiltersList`**:
  - Displays a list of `FilterCard` components.
  - Supports searching by name.
  - Allows deletion or editing of filters.
  - Clicking a `FilterCard` applies the filter to the builds and updates the URL.
- **`BuildsList`**:
  - Displays a list of `BuildCard` components.
  - Can be filtered and displays the filtered builds dynamically.

### Create and Edit Filter Pages

- Both pages share a common `FilterForm` component.
- The form facilitates creating or modifying filter name, groups and conditions.

# **URL Sharing Strategy**

- When a `FilterCard` is clicked, the URL changes to `/?filterId={filterId}`.
- If `filterId` is present in the URL, the builds are filtered using the associated filter.

# **Design Decisions and Trade-offs**

- **Radix UI**: Used for accessible and customizable components, enabling rapid development.
- **Prisma**: Chosen for its seamless integration with TypeScript and powerful query capabilities.
- **Zod**: Used for validation to ensure consistency in filter creation and editing.
- **SASS**: Adopted for structured and maintainable CSS.
- **React Hook Form**: Selected for its performant and flexible form handling with validation.
- **React Query**: Utilized for efficient asynchronous state management.

# Future improvements

- **Enhanced Filtering**:
  - Support for regular expression matching on string values.
- **Performance Optimization**:
  - Cache frequently used filters.
  - Optimize queries for complex nested conditions.
- **User Experience**:
  - Add pagination to the builds API for efficient handling of large result sets.
- **Security**:
  - Add authentication and role-based access control.
- **Graph-Based Linking**:
  - Use a graph structure for more efficient representation and traversal of nested filters.
- **Internationalization**:
  - Support multiple languages for broader accessibility.
