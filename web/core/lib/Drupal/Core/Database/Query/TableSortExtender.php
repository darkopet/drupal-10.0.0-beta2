<?php

namespace Drupal\Core\Database\Query;

use Drupal\Core\Database\Connection;
use Drupal\Core\Utility\TableSort;
use Symfony\Component\HttpFoundation\RequestStack;

/**
 * Query extender class for tablesort queries.
 */
class TableSortExtender extends SelectExtender {

  /**
   * Constructs a TableSortExtender object.
   *
   * @param \Drupal\Core\Database\Query\SelectInterface $query
   *   Select query object.
   * @param \Drupal\Core\Database\Connection $connection
   *   Database connection object.
   * @param \Symfony\Component\HttpFoundation\RequestStack $requestStack
   *   The request stack.
   */
  public function __construct(
    SelectInterface $query,
    Connection $connection,
    protected RequestStack $requestStack
  ) {
    parent::__construct($query, $connection);

    // Add convenience tag to mark that this is an extended query. We have to
    // do this in the constructor to ensure that it is set before preExecute()
    // gets called.
    $this->addTag('tablesort');
  }

  /**
   * Order the query based on a header array.
   *
   * @param array $header
   *   Table header array.
   *
   * @return \Drupal\Core\Database\Query\SelectInterface
   *   The called object.
   *
   * @see table.html.twig
   */
  public function orderByHeader(array $header) {
    $context = TableSort::getContextFromRequest($header, $this->requestStack->getCurrentRequest());
    if (!empty($context['sql'])) {
      // Based on code from \Drupal\Core\Database\Connection::escapeTable(),
      // but this can also contain a dot.
      $field = preg_replace('/[^A-Za-z0-9_.]+/', '', $context['sql']);

      // orderBy() will ensure that only ASC/DESC values are accepted, so we
      // don't need to sanitize that here.
      $this->orderBy($field, $context['sort']);
    }
    return $this;
  }

}
