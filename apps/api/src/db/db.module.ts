import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
    providers: [PrismaService],
    exports: [PrismaService],
})
export class DbModule { }

// Benefits of DbModule (Current Approach)
// Pros:
// Single Instance: Ensures PrismaService is a singleton across the entire app
// Global Access: @Global() decorator means you don't need to import it in every feature module
// Lifecycle Management: Centralized place for connection management (connect/disconnect)
// Testing: Easier to mock in tests - just override the module
// Best Practice: Follows NestJS recommended patterns for database modules
// Cons:
// Extra file/abstraction layer
// Might seem unnecessary for simple apps