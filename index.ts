import { CallHandler, createParamDecorator, ExecutionContext, Injectable, InternalServerErrorException, NestInterceptor } from '@nestjs/common';
import { APP_INTERCEPTOR, ModuleRef } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import DataLoader from 'dataloader';
import { Observable } from 'rxjs';

/**
 * This interface will be used to generate the initial data loader.
 * The concrete implementation should be added as a provider to your module.
 */
export interface NestDataLoader<ID, Type> {
    /**
     * Should return a new instance of dataloader each time
     */
    generateDataLoader(): DataLoader<ID, Type>;
}

/**
 * Context key where get loader function will be stored.
 * This class should be added to your module providers like so:
 * {
 *     provide: APP_INTERCEPTOR,
 *     useClass: DataLoaderInterceptor,
 * },
 */
const NEST_LOADER_CONTEXT_KEY: string = 'NEST_LOADER_CONTEXT_KEY';

@Injectable()
export class DataLoaderInterceptor implements NestInterceptor {
    constructor(private readonly moduleRef: ModuleRef) { }

    /**
     * @inheritdoc
     */
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const graphqlExecutionContext = GqlExecutionContext.create(context);
        const ctx: any = graphqlExecutionContext.getContext();

        if (ctx[NEST_LOADER_CONTEXT_KEY] === undefined) {
            ctx[NEST_LOADER_CONTEXT_KEY] = async (type: string) => {
                if (ctx[type] === undefined) {
                    try {
                        ctx[type] = (await this.moduleRef
                            .resolve<NestDataLoader<any, any>>(type, undefined, { strict: false }))
                            .generateDataLoader();
                    } catch (e) {
                        throw new InternalServerErrorException(`The loader ${type} is not provided` + e);
                    }
                }

                return ctx[type];
            };
        }
        return next.handle();
    }
}

/**
 * The decorator to be used within your graphql method.
 */
export const Loader = createParamDecorator(async (data: string, [_, __, ctx]) => {
    if (ctx[NEST_LOADER_CONTEXT_KEY] === undefined) {
        throw new InternalServerErrorException(`
            You should provide interceptor ${DataLoaderInterceptor.name} globally with ${APP_INTERCEPTOR}
          `);
    }

    return await ctx[NEST_LOADER_CONTEXT_KEY](data);
});
