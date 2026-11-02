# Risks and Technical Debts

- Large GPX files can consume browser storage or exceed the backend's 50 MB
  JSON request limit.
- GPX parsing and timing depend on the structure and completeness of uploaded
  files; unsupported or incomplete data can produce unusable segments.
- GeoApify and BigDataCloud quotas can be exhausted. Users can configure their
  own API keys in the planner settings.
- The backend stores JSON files locally, so availability and backups depend on
  the host running the service.
