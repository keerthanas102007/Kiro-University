/**
 * Sort Field Options
 */
export const SortField = {
  Priority: 'priority',
  CreatedAt: 'createdAt',
  CompletedAt: 'completedAt',
};

/**
 * Sort Order Options
 */
export const SortOrder = {
  Ascending: 'asc',
  Descending: 'desc',
};

/**
 * FilterCriteria Model
 * Represents the current filter and sort state
 */
export class FilterCriteria {
  constructor({
    searchQuery = '',
    priority = [],
    category = [],
    status = [],
    sortBy = SortField.CreatedAt,
    sortOrder = SortOrder.Descending,
  } = {}) {
    this.searchQuery = searchQuery;
    this.priority = priority;
    this.category = category;
    this.status = status;
    this.sortBy = sortBy;
    this.sortOrder = sortOrder;
  }
}
