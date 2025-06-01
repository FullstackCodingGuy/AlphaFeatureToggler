# AlphaFeatureToggler.API

This is the backend API service for the AlphaFeatureToggler project. It is built using .NET Core 9 and follows vertical clean architecture principles to ensure maintainability, scalability, and adherence to SOLID design patterns.

## Features

- **Feature Flag Management**: CRUD operations for feature flags.
- **Targeting & Segmentation**: Enable/disable flags for specific users, groups, or attributes.
- **Audit Logging**: Track changes to feature flags.
- **Multi-Environment Support**: Separate configurations for development, staging, and production.
- **Real-Time Updates**: Instant flag updates across services.
- **Role-Based Access Control (RBAC)**: Secure flag management with roles like admin, editor, and viewer.

## Getting Started

### Prerequisites

- .NET Core 9 SDK
- Visual Studio Code or any IDE of your choice

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/FullstackCodingGuy/AlphaFeatureToggler.git
   ```
2. Navigate to the API directory:
   ```bash
   cd src/AlphaFeatureToggler.API
   ```
3. Restore dependencies:
   ```bash
   dotnet restore
   ```
4. Run the application:
   ```bash
   dotnet run
   ```

## Project Structure

- **Controllers**: Define API endpoints.
- **Services**: Business logic for feature flag management.
- **Repositories**: Data access layer.
- **Models**: Define data structures.
- **Middlewares**: Custom middleware for logging, authentication, etc.

## Contributing

Contributions are welcome! Please follow the [contribution guidelines](CONTRIBUTING.md).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
