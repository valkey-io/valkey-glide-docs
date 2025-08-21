// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://valkey.io',
	base: '/valkey-glide-docs',
	integrations: [
		starlight({
			components: {
				Header: './src/components/Header.astro',
			},
			title: 'Valkey Glide',
			editLink: {
				baseUrl: 'https://github.com/valkey-io/valkey-glide-docs/edit/main/',
			},
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/valkey-io/valkey-glide' }],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Overview', slug: 'getting-started/overview' },
						{ label: 'Next Steps', slug: 'getting-started/next-steps' },
						{
							label: 'Quick Setup',
							items: [
								{ label: 'First Connection', slug: 'getting-started/quick-setup/first-connection' },
								{ label: 'Basic Operations', slug: 'getting-started/quick-setup/basic-operations' },
								{ label: 'Docker Environment', slug: 'getting-started/quick-setup/docker-environment' },
							],
						},
						{
							label: 'Tutorials',
							items: [
								{ label: 'Application Development', slug: 'getting-started/tutorials/application-development' },
								{ label: 'Caching App', slug: 'getting-started/tutorials/caching-app' },
								{ label: 'Clustering Guide', slug: 'getting-started/tutorials/clustering-guide' },
								{ label: 'Observability', slug: 'getting-started/tutorials/observability' },
								{ label: 'Production Ready', slug: 'getting-started/tutorials/production-ready' },
								{ label: 'Production', slug: 'getting-started/tutorials/production' },
								{ label: 'PubSub Notifications', slug: 'getting-started/tutorials/pubsub-notifications' },
							],
						},
					],
				},
				{
					label: 'Concepts',
					items: [
						{
							label: 'Architecture',
							items: [
								{ label: 'Async Execution', slug: 'concepts/architecture/async-execution' },
								{ label: 'Multiplexing', slug: 'concepts/architecture/multiplexing' },
								{ label: 'Performance Benefits', slug: 'concepts/architecture/performance-benefits' },
								{ label: 'Rust Core Design', slug: 'concepts/architecture/rust-core-design' },
							],
						},
						{
							label: 'Client Features',
							items: [
								{ label: 'Batching vs Pipelining', slug: 'concepts/client-features/batching-vs-pipelining' },
								{ label: 'Dynamic Authentication', slug: 'concepts/client-features/dynamic-authentication' },
								{ label: 'Observability Design', slug: 'concepts/client-features/observability-design' },
								{ label: 'PubSub Model', slug: 'concepts/client-features/pubsub-model' },
								{ label: 'Read Strategies Deep', slug: 'concepts/client-features/read-strategies-deep' },
								{ label: 'Reliability', slug: 'concepts/client-features/reliability' },
							],
						},
						{
							label: 'Comparison',
							items: [
								{ label: 'vs Lettuce', slug: 'concepts/comparison/vs-lettuce' },
								{ label: 'vs Redis Clients', slug: 'concepts/comparison/vs-redis-clients' },
								{ label: 'vs Redisson', slug: 'concepts/comparison/vs-redisson' },
							],
						},
						{
							label: 'Limitations',
							items: [
								{ label: 'Compatibility Matrix', slug: 'concepts/limitations/compatibility-matrix' },
								{ label: 'Known Issues', slug: 'concepts/limitations/known-issues' },
								{ label: 'Unsupported Features', slug: 'concepts/limitations/unsupported-features' },
							],
						},
						{
							label: 'Valkey Integration',
							items: [
								{ label: 'Cluster Concepts', slug: 'concepts/valkey-integration/cluster-concepts' },
								{ label: 'Command Routing', slug: 'concepts/valkey-integration/command-routing' },
								{ label: 'Data Types', slug: 'concepts/valkey-integration/data-types' },
								{ label: 'Modules Support', slug: 'concepts/valkey-integration/modules-support' },
							],
						},
					],
				},
				{
					label: 'How-To Guides',
					items: [
						{
							label: 'Cloud Deployment',
							items: [
								{ label: 'AWS ElastiCache', slug: 'how-to/cloud-deployment/aws-elasticache' },
								{ label: 'AWS MemoryDB', slug: 'how-to/cloud-deployment/aws-memorydb' },
								{ label: 'GCP Memorystore', slug: 'how-to/cloud-deployment/gcp-memorystore' },
							],
						},
						{
							label: 'Connection Management',
							items: [
								{ label: 'Cluster Topology', slug: 'how-to/connection-management/cluster-topology' },
								{ label: 'Connection Pooling', slug: 'how-to/connection-management/connection-pooling' },
								{ label: 'Dynamic Passwords', slug: 'how-to/connection-management/dynamic-passwords' },
								{ label: 'Failover Handling', slug: 'how-to/connection-management/failover-handling' },
							],
						},
						{
							label: 'Framework Integration',
							items: [
								{ label: 'ASP.NET Core', slug: 'how-to/framework-integration/asp-net-core' },
								{ label: 'Django', slug: 'how-to/framework-integration/django' },
								{ label: 'Express.js', slug: 'how-to/framework-integration/express-js' },
								{ label: 'Gin Gonic', slug: 'how-to/framework-integration/gin-gonic' },
								{ label: 'Spring Boot', slug: 'how-to/framework-integration/spring-boot' },
							],
						},
						{
							label: 'Monitoring',
							items: [
								{ label: 'Alerting', slug: 'how-to/monitoring/alerting' },
								{ label: 'Logging Setup', slug: 'how-to/monitoring/logging-setup' },
								{ label: 'Metrics Collection', slug: 'how-to/monitoring/metrics-collection' },
								{ label: 'Troubleshooting', slug: 'how-to/monitoring/troubleshooting' },
							],
						},
						{
							label: 'Operations',
							items: [
								{ label: 'Cluster Scan', slug: 'how-to/operations/cluster-scan' },
								{ label: 'Custom Commands', slug: 'how-to/operations/custom-commands' },
								{ label: 'Error Handling', slug: 'how-to/operations/error-handling' },
								{ label: 'Multi Slot Commands', slug: 'how-to/operations/multi-slot-commands' },
								{ label: 'Timeouts & Retries', slug: 'how-to/operations/timeouts-retries' },
							],
						},
						{
							label: 'Performance',
							items: [
								{ label: 'Batch Operations', slug: 'how-to/performance/batch-operations' },
								{ label: 'Client Side Caching', slug: 'how-to/performance/client-side-caching' },
								{ label: 'Optimization Tips', slug: 'how-to/performance/optimization-tips' },
								{ label: 'Pipelining', slug: 'how-to/performance/pipelining' },
								{ label: 'Read Strategies', slug: 'how-to/performance/read-strategies' },
							],
						},
						{
							label: 'Security',
							items: [
								{ label: 'Access Control', slug: 'how-to/security/access-control' },
								{ label: 'Authentication', slug: 'how-to/security/authentication' },
								{ label: 'Enable TLS', slug: 'how-to/security/enable-tls' },
								{ label: 'IAM Integration', slug: 'how-to/security/iam-integration' },
							],
						},
					],
				},
				{
					label: 'Languages',
					items: [
						{
							label: 'C#',
							autogenerate: { directory: 'languages/csharp' },
						},
						{
							label: 'Go',
							autogenerate: { directory: 'languages/go' },
						},
						{
							label: 'Java',
							autogenerate: { directory: 'languages/java' },
						},
						{
							label: 'Node.js',
							autogenerate: { directory: 'languages/nodejs' },
						},
						{
							label: 'Python',
							autogenerate: { directory: 'languages/python' },
						},
					],
				},
				{
					label: 'Migration',
					items: [
						{ label: 'Index', slug: 'migration/overview' },
						{
							label: 'From Redis Clients',
							items: [
								{ label: 'List & Redirect', slug: 'migration/from-redis-clients/redirect-to-client-documentation' },
							],
						},
						{
							label: 'Planning',
							items: [
								{ label: 'Migration Strategy', slug: 'migration/planning/migration-strategy' },
								{ label: 'Risk Assessment', slug: 'migration/planning/risk-assessment' },
								{ label: 'Rollback Plan', slug: 'migration/planning/rollback-plan' },
								{ label: 'Testing Approach', slug: 'migration/planning/testing-approach' },
							],
						},
					],
				},
				{
					label: 'Reference',
					items: [
						{
							label: 'API',
							items: [
								{
									label: 'Commands',
									autogenerate: { directory: 'reference/api/commands' },
								},
								{
									label: 'Common',
									autogenerate: { directory: 'reference/api/common' },
								},
							],
						},
						{
							label: 'Compatibility',
							items: [
								{ label: 'Language Versions', slug: 'reference/compatibility/language-versions' },
								{ label: 'Platform Support', slug: 'reference/compatibility/platform-support' },
								{ label: 'Redis Versions', slug: 'reference/compatibility/redis-versions' },
								{ label: 'Valkey Versions', slug: 'reference/compatibility/valkey-versions' },
							],
						},
						{
							label: 'Configuration',
							items: [
								{ label: 'Connection Options', slug: 'reference/configuration/connection-options' },
								{ label: 'Environment Variables', slug: 'reference/configuration/environment-variables' },
								{ label: 'Logging Options', slug: 'reference/configuration/logging-options' },
								{ label: 'Performance Options', slug: 'reference/configuration/performance-options' },
								{ label: 'Security Options', slug: 'reference/configuration/security-options' },
							],
						},
						{
							label: 'Errors',
							items: [
								{ label: 'Error Codes', slug: 'reference/errors/error-codes' },
								{ label: 'Exception Types', slug: 'reference/errors/exception-types' },
								{ label: 'Troubleshooting Guide', slug: 'reference/errors/troubleshooting-guide' },
							],
						},
						{
							label: 'Releases',
							items: [
								{ label: 'Changelog', slug: 'reference/releases/changelog' },
								{ label: 'Release Notes', slug: 'reference/releases/release-notes' },
								{ label: 'Roadmap', slug: 'reference/releases/roadmap' },
							],
						},
					],
				},
			],
		}),
	],
});
