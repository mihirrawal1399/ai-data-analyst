import { Controller, Post, Body, HttpCode, HttpStatus, Param, UseGuards, HttpException, Req } from '@nestjs/common';
import { AgentService } from './agent.service';
import { AuthGuard } from '../../guards/auth.guard';

// DTO for query request
interface QueryRequestDto {
    datasetId: string;
    question: string;
    limit?: number;
    userId?: string;
    userApiKey?: string;
}

@Controller('agent')
export class AgentController {
    constructor(private readonly agentService: AgentService) { }

    /**
     * Process natural language query
     * POST /agent/query
     * 
     * Body: {
     *   datasetId: string,
     *   question: string,
     *   limit?: number,
     *   userId?: string,
     *   userApiKey?: string
     * }
     */
    @Post('query')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard) // Require auth (includes guest)
    async naturalLanguageQuery(@Body() body: QueryRequestDto, @Req() req: any) {
        const user = req.user;

        // Check guest limitations
        if (user?.role === 'GUEST') {
            const { trackGuestQuery, isGuestSessionExpired } = await import('../../utils/guest-tracking.util');

            // Check session expiry
            const expired = await isGuestSessionExpired(user.id);
            if (expired) {
                throw new HttpException(
                    'Your demo session has expired. Please sign up for free to continue.',
                    HttpStatus.FORBIDDEN
                );
            }

            // Track query usage
            const allowed = await trackGuestQuery(user.id);
            if (!allowed) {
                throw new HttpException(
                    'You have reached your query limit for this demo session. Sign up for free to get 50 queries per day.',
                    HttpStatus.FORBIDDEN
                );
            }
        }

        return this.agentService.processQuery(
            body.datasetId,
            body.question,
            {
                limit: body.limit,
                userId: body.userId,
                userApiKey: body.userApiKey,
            }
        );
    }

    /**
     * Analyze dataset
     * POST /agent/analyze
     */
    @Post('analyze')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async analyzeDataset(@Body() body: { datasetId: string }) {
        return this.agentService.analyzeDataset(body.datasetId);
    }

    /**
     * Get dashboard insights
     * POST /agent/insights/dashboard/:dashboardId
     */
    @Post('insights/dashboard/:dashboardId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async getDashboardInsights(@Param('dashboardId') dashboardId: string) {
        return this.agentService.analyzeDashboard(dashboardId);
    }

    /**
     * Get dataset insights
     * POST /agent/insights/dataset/:datasetId
     */
    @Post('insights/dataset/:datasetId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async getDatasetInsights(@Param('datasetId') datasetId: string) {
        return this.agentService.analyzeDataset(datasetId);
    }

    /**
     * Suggest charts for a dataset
     * POST /agent/suggest-charts/:datasetId
     */
    @Post('suggest-charts/:datasetId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async suggestCharts(@Param('datasetId') datasetId: string) {
        return this.agentService.suggestCharts(datasetId);
    }
}

